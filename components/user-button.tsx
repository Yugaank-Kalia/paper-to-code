'use client';

import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import {
	LogOut,
	Settings,
	ChevronDown,
	LayoutDashboard,
	Bell,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { ThemeToggle } from './theme-toggle';

export default function UserButton() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();
	const [open, setOpen] = useState(false);

	if (isPending) return null;
	if (!session) return null;

	const user = session.user;
	const initials = user.name
		? user.name
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
				.slice(0, 2)
		: user.email.charAt(0).toUpperCase();

	async function handleSignOut() {
		await authClient.signOut();
		router.push('/');
	}

	function navigate(path: string) {
		setOpen(false);
		router.push(path);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild className='cursor-pointer'>
				<button className='flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'>
					<Avatar className='h-10 w-10'>
						<AvatarImage
							src={user.image ?? undefined}
							alt={user.name ?? 'User'}
						/>
						<AvatarFallback className='text-[10px] font-medium'>
							{initials}
						</AvatarFallback>
					</Avatar>
					<span className='text-xs font-medium max-w-20 truncate hidden sm:block'>
						{user.name?.split(' ')[0] ?? user.email}
					</span>
					<ChevronDown className='h-3 w-3 text-muted-foreground hidden sm:block' />
				</button>
			</PopoverTrigger>

			<PopoverContent align='end' sideOffset={6} className='w-52 p-0'>
				{/* User info */}
				<div className='flex items-center gap-2.5 px-3 py-2.5'>
					<Avatar className='h-8 w-8 shrink-0'>
						<AvatarImage
							src={user.image ?? undefined}
							alt={user.name ?? 'User'}
						/>
						<AvatarFallback className='text-sm font-medium'>
							{initials}
						</AvatarFallback>
					</Avatar>
					<div className='flex flex-col min-w-0'>
						<p className='text-sm font-semibold leading-none truncate'>
							{user.name}
						</p>
						<p className='text-xs text-muted-foreground truncate mt-0.5'>
							{user.email}
						</p>
					</div>
				</div>

				<Separator />

				<div className='p-1'>
					<button
						onClick={() => navigate('/settings')}
						className='cursor-pointer flex w-full items-center gap-2 rounded-md p-3 hover:bg-muted transition-colors text-left'
					>
						<Settings className='h-3.5 w-3.5 text-muted-foreground' />
						<span className='text-accent-foreground text-sm'>
							Settings
						</span>
					</button>

					{/* Mobile-only items */}
					<div className='sm:hidden'>
						<button
							onClick={() => navigate('/dashboard')}
							className='cursor-pointer flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors text-left'
						>
							<LayoutDashboard className='h-3.5 w-3.5 text-muted-foreground' />
							<span className='text-accent-foreground text-sm'>
								Dashboard
							</span>
						</button>

						<button
							onClick={() => navigate('/notifications')}
							className='cursor-pointer flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-muted transition-colors text-left'
						>
							<Bell className='h-3.5 w-3.5 text-muted-foreground' />
							<span className='text-accent-foreground text-sm'>
								Notifications
							</span>
						</button>

						<div className='flex items-center gap-2 rounded-md px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer'>
							<span className='text-accent-foreground text-sm flex-1'>
								Theme
							</span>
							<ThemeToggle />
						</div>
					</div>
				</div>

				<Separator />

				<div className='p-1'>
					<button
						onClick={handleSignOut}
						className='cursor-pointer flex w-full items-center gap-2 rounded-md p-3 hover:bg-destructive/10 transition-colors text-left'
					>
						<LogOut className='h-3.5 w-3.5 text-destructive' />
						<span className='text-destructive text-sm'>
							Sign out
						</span>
					</button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
