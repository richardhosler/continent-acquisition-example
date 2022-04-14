export const Footer = () => {
  return (
    <div className="flex fixed bottom-0 w-screen text-slate-900 p-4 place-content-between mr-2">
      <span>
        Example project by{" "}
        <a
          href="https://github.com/Chrykal"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Richard Hosler
        </a>
      </span>
      <span>
        <a href="https://github.com/" className="hover:underline">
          project GitHub
        </a>
      </span>
      <span>Built using React, Next.js, TypeScript, HardHat and Solidity</span>
    </div>
  );
};
