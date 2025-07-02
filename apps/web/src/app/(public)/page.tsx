import type { NextPage } from "next";
import Crafter from "@/components/crafter";
import Navtop from "@/components/crafter/nav-top";

const Page: NextPage = () => {
	return (
		<div className="h-screen w-full bg-gradient-to-br from-background to-muted relative py-8 px-20 overflow-hidden">
			<div className="size-full shadow-2xl bg-background rounded-3xl border flex flex-col">
				<Navtop />
				<Crafter />
			</div>
		</div>
	);
};

export default Page;
