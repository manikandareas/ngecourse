import { Card } from '~/components/ui/card';
import { type Chapter, ChapterItem } from './chapter-item';

const courseData: Chapter[] = [
	{
		id: 1,
		title: 'Hello World',
		description:
			'Learn how to write your first line of Python by printing messages to the terminal.',
		items: [
			{ type: 'exercise', number: 1, title: 'Setting Up', status: 'start' },
			{ type: 'exercise', number: 2, title: 'Hello World', status: 'locked' },
			{ type: 'exercise', number: 3, title: 'Pattern', status: 'locked' },
			{ type: 'exercise', number: 4, title: 'Initials', status: 'locked' },
			{ type: 'exercise', number: 5, title: 'Snail Mail', status: 'locked' },
			{ type: 'bonus', title: 'Complete chapter to unlock', status: 'locked' },
		],
	},
	{
		id: 2,
		title: 'Variables',
		description: 'Learn about variables in Python.',
		items: [],
	},
	{
		id: 3,
		title: 'Control Flow',
		description: 'Learn about control flow in Python.',
		items: [],
	},
	{
		id: 4,
		title: 'Loops',
		description: 'Learn about loops in Python.',
		items: [],
	},
	{
		id: 5,
		title: 'Checkpoint Project',
		description: '',
		items: [],
		type: 'checkpoint',
	},
	{
		id: 6,
		title: 'Lists',
		description: '',
		items: [],
	},
	{
		id: 7,
		title: 'Functions',
		description: '',
		items: [],
	},
	{
		id: 8,
		title: 'Classes & Objects',
		description: '',
		items: [],
	},
];

export function PathSection() {
	return (
		<Card className='mx-auto w-full p-4'>
			{courseData.map((chapter, index) => (
				<ChapterItem
					chapter={chapter}
					isFirst={index === 0}
					isLast={index === courseData.length - 1}
					key={chapter.id}
				/>
			))}
		</Card>
	);
}
