import { useState } from 'react';
import { Button } from '~/components/ui/button';

export interface CourseItem {
	type: 'exercise' | 'bonus';
	number?: number;
	title: string;
	status: 'start' | 'locked' | 'completed';
}

export interface Chapter {
	id: number;
	title: string;
	description: string;
	items: CourseItem[];
	type?: 'checkpoint';
}

interface ChapterItemProps {
	chapter: Chapter;
	isFirst: boolean;
	isLast: boolean;
}

export function ChapterItem({ chapter, isFirst, isLast }: ChapterItemProps) {
	const [isExpanded, setIsExpanded] = useState(isFirst);

	const handleToggle = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<div className="flex">
			<div className='mr-6 flex flex-col items-center'>
				<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300 bg-gray-100 font-bold text-gray-600'>
					{chapter.type === 'checkpoint' ? (
						<svg
							fill="none"
							height="20"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<title>Checkpoint</title>
							<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
							<circle cx="12" cy="10" r="3" />
						</svg>
					) : (
						chapter.id
					)}
				</div>
				{!isLast && <div className='h-full w-0.5 bg-gray-200' />}
			</div>
			<div className="w-full">
				<button
					className='flex w-full cursor-pointer items-center justify-between border-none bg-transparent py-2 text-left'
					onClick={handleToggle}
					type="button"
				>
					<h2 className='font-sans font-semibold text-2xl'>{chapter.title}</h2>
					<span
						className={`inline-block border-black border-t-0 border-r-2 border-b-2 border-l-0 border-solid p-0.5 transition-transform duration-200 ${isExpanded ? '-rotate-135 transform' : 'rotate-45 transform'}`}
					/>
				</button>
				{isExpanded && (
					<div className='mt-2 rounded-lg bg-secondary-background p-4'>
						<p className="text-muted-foreground text-sm">{chapter.description}</p>
						<ul className='m-0 list-none p-0'>
							{chapter.items.map((item) => (
								<li
									className='flex items-center justify-between border-gray-200 border-b py-3 text-sm last:border-b-0'
									key={item.title}
								>
									<span>
										{item.type === 'exercise'
											? `Exercise ${item.number}`
											: 'Bonus Article'}
										: {item.title}
									</span>
									<Button
										className="font-heading"
										type="button"
										variant={item.status === 'start' ? 'default' : 'outline'}
									>
										{item.status === 'start' ? 'Start' : '???'}
									</Button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
}
