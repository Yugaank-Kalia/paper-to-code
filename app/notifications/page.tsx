// app/notifications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import {
	getNotifications,
	markNotificationRead,
	dismissNotification,
} from '@/app/dashboard/actions/get-notifications';
import { formatDistanceToNow } from 'date-fns';
import { Bell, ArrowLeft, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

type Notification = {
	id: string;
	title: string;
	description: string;
	status: string;
	read: boolean;
	paperId: string | null;
	createdAt: Date | null;
};

const dotStyles: Record<string, string> = {
	success: 'bg-green-500',
	error: 'bg-destructive',
	info: 'bg-primary',
};

const badgeVariant: Record<
	string,
	'default' | 'destructive' | 'outline' | 'secondary'
> = {
	success: 'default',
	error: 'destructive',
	info: 'secondary',
};

export default function NotificationsPage() {
	const { data: session, isPending } = authClient.useSession();
	const router = useRouter();

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	useEffect(() => {
		if (!isPending && !session) router.push('/sign-in');
	}, [isPending, session, router]);

	useEffect(() => {
		if (!session) return;
		getNotifications().then((result) => {
			if (result.status === 'ok') {
				setNotifications(result.notifications as Notification[]);
			}
			setLoading(false);
		});
	}, [session]);

	const totalPages = Math.ceil(notifications.length / rowsPerPage);
	const paginated = notifications.slice(
		(page - 1) * rowsPerPage,
		page * rowsPerPage,
	);

	async function handleMarkRead(id: string, paperId?: string | null) {
		setNotifications((prev) =>
			prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
		);
		await markNotificationRead(id);
		if (paperId) router.push(`/dashboard/code/${paperId}`);
	}

	async function handleDismiss(id: string) {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
		await dismissNotification(id);
	}

	if (isPending || loading) {
		return (
			<div className='mx-auto max-w-3xl px-4 py-12 space-y-4'>
				<Skeleton className='h-8 w-48' />
				{[...Array(5)].map((_, i) => (
					<Skeleton key={i} className='h-20 w-full rounded-lg' />
				))}
			</div>
		);
	}

	return (
		<div className='min-h-[calc(100vh-65px)] bg-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]'>
			<div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
				<div className='absolute h-125 w-125 bg-primary/5 blur-[120px] rounded-full -top-40 -right-40' />
				<div className='absolute h-100 w-100 bg-purple-500/5 blur-[100px] rounded-full bottom-0 -left-40' />
			</div>

			<div className='mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8'>
				{/* Header */}
				<div className='flex items-center justify-between mb-8'>
					<div className='flex items-center gap-3'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => router.back()}
							className='gap-2 text-muted-foreground hover:text-foreground'
						>
							<ArrowLeft className='h-4 w-4' />
							Back
						</Button>
					</div>
					<Select
						value={String(rowsPerPage)}
						onValueChange={(v) => {
							setRowsPerPage(Number(v));
							setPage(1);
						}}
					>
						<SelectTrigger className='w-36'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='5'>5 per page</SelectItem>
							<SelectItem value='10'>10 per page</SelectItem>
							<SelectItem value='20'>20 per page</SelectItem>
							<SelectItem value='50'>50 per page</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className='mb-6'>
					<h1 className='text-3xl font-bold tracking-tight'>
						Notifications
					</h1>
					<p className='text-muted-foreground text-sm mt-1'>
						{notifications.filter((n) => !n.read).length} unread ·{' '}
						{notifications.length} total
					</p>
				</div>

				{/* List */}
				{notifications.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground'>
						<Bell className='h-10 w-10 opacity-20' />
						<p className='text-sm'>No notifications yet</p>
					</div>
				) : (
					<div className='space-y-2'>
						{paginated.map((n) => (
							<div
								key={n.id}
								onClick={() => handleMarkRead(n.id, n.paperId)}
								className={cn(
									'flex items-start gap-4 p-4 rounded-lg border border-border/50 cursor-pointer transition-colors hover:bg-muted/50',
									!n.read && 'bg-muted/30 border-primary/10',
								)}
							>
								{/* Dot */}
								<div className='mt-1.5 shrink-0'>
									<div
										className={cn(
											'h-2 w-2 rounded-full',
											dotStyles[n.status] ?? 'bg-primary',
											n.read && 'opacity-30',
										)}
									/>
								</div>

								{/* Content */}
								<div className='flex-1 min-w-0 space-y-1'>
									<div className='flex items-center gap-2 flex-wrap'>
										<p
											className={cn(
												'text-sm leading-snug',
												!n.read && 'font-semibold',
											)}
										>
											{n.title}
										</p>
										<Badge
											variant={
												badgeVariant[n.status] ??
												'outline'
											}
											className='text-[10px] px-1.5 py-0'
										>
											{n.status}
										</Badge>
										{!n.read && (
											<Badge
												variant='outline'
												className='text-[10px] px-1.5 py-0 border-primary/30 text-primary'
											>
												New
											</Badge>
										)}
									</div>
									<p className='text-xs text-muted-foreground leading-snug'>
										{n.description}
									</p>
									<p className='text-xs text-muted-foreground/60'>
										{n.createdAt
											? formatDistanceToNow(
													new Date(n.createdAt),
													{ addSuffix: true },
												)
											: ''}
									</p>
								</div>

								{/* Dismiss */}
								<Button
									variant='ghost'
									size='icon'
									className='h-7 w-7 shrink-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10'
									onClick={(e) => {
										e.stopPropagation();
										handleDismiss(n.id);
									}}
								>
									<Trash2 className='h-3.5 w-3.5' />
								</Button>
							</div>
						))}
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='mt-8 flex items-center justify-between'>
						<p className='text-xs text-muted-foreground'>
							Page {page} of {totalPages}
						</p>
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										onClick={() =>
											setPage((p) => Math.max(1, p - 1))
										}
										className={cn(
											'cursor-pointer',
											page === 1 &&
												'pointer-events-none opacity-50',
										)}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										onClick={() =>
											setPage((p) =>
												Math.min(totalPages, p + 1),
											)
										}
										className={cn(
											'cursor-pointer',
											page === totalPages &&
												'pointer-events-none opacity-50',
										)}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				)}
			</div>
		</div>
	);
}
