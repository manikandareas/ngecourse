import { ArrowRightIcon, Share2Icon } from 'lucide-react';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';

interface IHeroSection {
    difficulty: string;
    title: string;
    description: string;
    image: string;
}

export function HeroSection(props: IHeroSection) {
    return (
        <div>
            <div className='mb-8 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center sm:gap-0'>
                <div className="space-y-2">
                    <Badge className="capitalize">{props.difficulty.toLowerCase()}</Badge>
                    <h1 className="font-bold text-4xl">{props.title}</h1>
                    <p className="text-muted-foreground text-sm">{props.description}</p>
                </div>
                <div className="flex items-center gap-2.5">
                    <Button size={'icon'} variant={'outline'}>
                        <Share2Icon />
                    </Button>
                    <Button size={'lg'}>
                        Start Learning Now <ArrowRightIcon />
                    </Button>
                </div>
            </div>
            <img
                alt={props.title}
                className="mx-auto mb-8 h-[22rem] w-full rounded-md object-cover"
                src={props.image}
            />
        </div>
    );
}
