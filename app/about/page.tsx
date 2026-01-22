export const metadata = {
  title: "About — Radio Agakiza",
};

export default function AboutPage() {
  return (
    <div className="prose max-w-none dark:prose-invert">
      <h1>About Radio Agakiza</h1>
      <p>
        Radio Agakiza is a live Christian radio station sharing the Gospel with hope-filled
        programs, news, and testimonies. You can listen live anytime using the player at the bottom of the page.
      </p>
      <h2>Contact</h2>
      <p className="not-prose">
        <a href="mailto:info@radioagakiza.rw" className="underline">info@radioagakiza.rw</a>
      </p>
    </div>
  );
}
