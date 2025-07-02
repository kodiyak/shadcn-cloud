import Image from "next/image";
import Logo from "@/assets/logo.png";

export default function Navtop() {
	return (
		<div className="w-full h-16 border-b flex items-center px-3">
			<Image
				width={50}
				height={50}
				src={Logo.src}
				alt={"Shadcn Cloud"}
				className="size-11 rounded-2xl"
			/>
		</div>
	);
}
