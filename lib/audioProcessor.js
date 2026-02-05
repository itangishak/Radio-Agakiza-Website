const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs').promises;

const AUDIO_SETTINGS = {
  sampleRate: 44100,
  bitrate: '128k',
  channels: 2,
  format: 'mp3'
};

class AudioProcessor {
  static async processAudio(inputPath, originalName, progressCallback) {
    const timestamp = Date.now();
    const baseName = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_');
    const outputFileName = `${baseName}_${timestamp}.mp3`;
    const outputPath = path.join(process.cwd(), 'public', 'uploads', 'audio', outputFileName);

    // Ensure audio directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Get file size for progress tracking
    const stats = await fs.stat(inputPath);
    const totalMB = (stats.size / (1024 * 1024)).toFixed(2);

    progressCallback?.({ 
      algorithm: 'Kaiser-Windowed Sinc Polyphase FIR', 
      progress: 0, 
      processedMB: 0, 
      totalMB 
    });

    return new Promise((resolve, reject) => {
      const run = (withFilter) => {
        let command = ffmpeg(inputPath)
          .audioCodec('libmp3lame')
          .audioBitrate(AUDIO_SETTINGS.bitrate)
          .audioChannels(AUDIO_SETTINGS.channels)
          .audioFrequency(AUDIO_SETTINGS.sampleRate)
          .format('mp3')
          .on('progress', (progress) => {
            const percent = Math.round(progress.percent || 0);
            const processedMB = ((percent / 100) * stats.size / (1024 * 1024)).toFixed(2);
            progressCallback?.({ 
              algorithm: 'Kaiser-Windowed Sinc Polyphase FIR', 
              progress: percent, 
              processedMB, 
              totalMB 
            });
          })
          .on('end', async () => {
            try {
              const outputStats = await fs.stat(outputPath);
              resolve({
                url: `/uploads/audio/${outputFileName}`,
                size: outputStats.size,
                format: 'mp3'
              });
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            const msg = String(error && error.message || '');
            if (withFilter && /(aresample|soxr|filter|Option not found|No such filter)/i.test(msg)) {
              run(false);
            } else {
              reject(new Error(`Audio processing failed: ${error.message}`));
            }
          });
        if (withFilter) {
          command = command.audioFilters([
            `aresample=resampler=soxr:precision=28:cheby=1:dither_method=shibata`
          ]);
        }
        command.save(outputPath);
      };
      run(true);
    });
  }

  static async deleteAudio(audioUrl) {
    if (!audioUrl) return;
    
    const filePath = path.join(process.cwd(), 'public', audioUrl);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete ${filePath}:`, error);
    }
  }
}

module.exports = AudioProcessor;
