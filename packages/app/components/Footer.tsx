import Image from "next/image";
import githubIcon from "../assets/icons/github.svg";
export const Footer = () => {
  return (
    <div className="flex fixed bottom-0 w-screen text-slate-500 p-4 place-content-center space-x-1 text-xs">
      <span>
        Example project by{" "}
        <a
          href="https://github.com/richardhosler/continent-aquisition-example"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Richard Hosler{"  "}
          <span className="relative top-0.5">
            <Image src={githubIcon} alt="Github Icon" width={15} height={15} />
          </span>
        </a>
        {"  "}
        Built using Next.js, TypeScript &amp; Solidity.
      </span>

      <span></span>
    </div>
  );
};
