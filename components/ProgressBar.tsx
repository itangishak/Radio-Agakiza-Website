"use client";
interface ProgressBarProps {
  algorithm: string;
  progress: number;
  processedMB: string;
  totalMB: string;
}

export default function ProgressBar({ algorithm, progress, processedMB, totalMB }: ProgressBarProps) {
  return (
    <div className="mt-2 p-3 bg-blue-50 rounded-md border">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-blue-800">{algorithm}</span>
        <span className="text-sm text-blue-600">{progress}%</span>
      </div>
      <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-xs text-blue-600">
        {processedMB} MB / {totalMB} MB processed
      </div>
    </div>
  );
}
