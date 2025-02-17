
interface LogoProps {
    position: string;
  }

export default function Logo({ position }: LogoProps) {
    return (
        <h1 className={"font-mono tracking-tight font-bold mt-6 "+position}>
            <span>SELFRIDGES</span>
            <span className="text-white webkit-text-stroke-black relative">&C<span className="text-[13px] absolute">O</span></span>
        </h1>
    );
}