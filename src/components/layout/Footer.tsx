import { Code2, Github, MessageSquareDiff, Twitter } from 'lucide-react'

import { Button } from '../ui/Button/Button'

export function Footer() {
	return (
		<footer className="border-t border-white/5 px-6 pt-24 pb-12">
			<div className="mx-auto max-w-7xl">
				<div className="mb-24 grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-6">
					<div className="col-span-2">
						<div className="mb-6 flex items-center gap-2">
							<div className="bg-primary/20 rounded-lg p-2">
								<Code2 className="text-primary h-6 w-6" />
							</div>
							<span className="text-2xl font-bold tracking-tighter">TeaCoder</span>
						</div>
						<p className="text-muted-foreground mb-8 max-w-xs text-lg leading-relaxed">
							Structured engineering knowledge for the modern developer.
						</p>
						<div className="flex gap-4">
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full hover:bg-white/5"
							>
								<Twitter className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full hover:bg-white/5"
							>
								<Github className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full hover:bg-white/5"
							>
								<MessageSquareDiff className="h-5 w-5" />
							</Button>
						</div>
					</div>

					<div>
						<h4 className="mb-6 font-bold">Platform</h4>
						<ul className="text-muted-foreground space-y-4">
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Courses
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Leaderboard
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Premium
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Dashboard
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-6 font-bold">Resources</h4>
						<ul className="text-muted-foreground space-y-4">
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Documentation
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Community
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Source Code
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Changelog
								</a>
							</li>
						</ul>
					</div>

					<div className="col-span-2 lg:col-span-1">
						<h4 className="mb-6 font-bold">Legal</h4>
						<ul className="text-muted-foreground space-y-4">
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Privacy Policy
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Terms of Service
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-primary transition-colors">
									Cookie Policy
								</a>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 md:flex-row">
					<p className="text-muted-foreground text-sm">
						© 2024 TeaCoder Engineering Platform. All rights reserved.
					</p>
					<div className="text-muted-foreground flex items-center gap-2 text-sm">
						<div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
						All systems operational
					</div>
				</div>
			</div>
		</footer>
	)
}
