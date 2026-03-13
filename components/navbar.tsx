'use client';

import { Code } from 'lucide-react';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from './theme-toggle';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import UserButton from './user-button';
import { Notifications } from './notifications';

export function Navbar() {
	const { data: session, isPending } = useSession();
	const user = session?.user;
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const ready = mounted && !isPending;

	return (
		<nav className='sticky top-0 z-50 border-b border-border/20 bg-background/50 backdrop-blur-md'>
			<div className='mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between'>
				{/* Logo */}
				<Link href='/'>
					<div className='flex items-center gap-2'>
						<Code className='h-6 w-6 text-primary' />
						<h1 className='text-xl font-bold'>Paper2Code</h1>
					</div>
				</Link>

				{/* Right side */}
				<div className='flex items-center gap-3'>
					{!ready ? (
						<div className='flex items-center gap-3'>
							{/* Desktop skeletons */}
							<div className='hidden sm:flex items-center gap-3'>
								<Skeleton className='h-8 w-8 rounded-md' />
								<Skeleton className='h-8 w-8 rounded-md' />
								<Skeleton className='h-8 w-20 rounded-md' />
							</div>
							{/* pill skeleton on desktop, circle on mobile */}
							<Skeleton className='hidden sm:block h-12 w-36 rounded-full' />
							<Skeleton className='h-10 w-10 rounded-full sm:hidden' />
						</div>
					) : user?.id ? (
						<>
							{/* Desktop only */}
							<div className='hidden sm:flex items-center gap-3'>
								<Notifications />
								<ThemeToggle />
								<Link href='/dashboard'>
									<Button
										className='cursor-pointer'
										variant='default'
										size='sm'
									>
										Dashboard
									</Button>
								</Link>
							</div>
							<UserButton />
						</>
					) : (
						<>
							{/* Theme toggle always visible when logged out */}
							<ThemeToggle />
							<div className='flex items-center gap-2'>
								<Link href='/sign-in'>
									<Button
										className='cursor-pointer'
										variant='ghost'
										size='sm'
									>
										Sign In
									</Button>
								</Link>
								<Link href='/sign-up'>
									<Button
										className='cursor-pointer'
										variant='outline'
										size='sm'
									>
										Sign Up
									</Button>
								</Link>
							</div>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
