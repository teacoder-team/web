import { Header } from "@/components/layout/Header";
import { type ReactNode } from "react";

export default function PublicLayout({ children }: { children: ReactNode }) {
	return (
		<div className="min-h-screen bg-background overflow-x-hidden">
			<Header />
			{children}
		</div>
	);
}
