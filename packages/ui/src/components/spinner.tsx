import { motion } from 'motion/react';
import { cn } from '../lib/utils';

function Spinner({
	size = 20,
	className,
	barWidth: barWidthInput = 0.08,
	barHeight: barHeightInput = 0.23,
	radius: radiusInput = 0.4,
	duration = 1.78,
	barCount = 10,
}: {
	size?: number;
	className?: string;
	barWidth?: number;
	barHeight?: number;
	radius?: number;
	duration?: number;
	barCount?: number;
}) {
	const barWidth = size * barWidthInput;
	const barHeight = size * barHeightInput;
	const radius = size * radiusInput;

	return (
		<div
			className={cn('relative', className)}
			style={{
				width: size,
				height: size,
			}}
		>
			{[...Array(barCount)].map((_, index) => {
				const angle = (index * 2 * Math.PI) / barCount;
				const x = size / 2 + radius * Math.cos(angle);
				const y = size / 2 + radius * Math.sin(angle);
				const rotation = angle * (180 / Math.PI) + 90;

				return (
					<motion.div
						className="absolute bg-transparent rounded-[0]"
						key={`spinner-bar-${index as any}`}
						style={{
							left: `${x - barWidth / 2}px`,
							top: `${y - barHeight / 2}px`,
							width: barWidth,
							height: barHeight,
							transform: `rotate(${rotation}deg)`,
							transformOrigin: 'center center',
						}}
					>
						<motion.div
							animate={{
								opacity: [0, 1, 0],
							}}
							className="bg-foreground h-full left-0 absolute w-full bottom-0"
							transition={{
								repeat: Infinity,
								duration: duration,
								delay: index === 0 ? 0 : index * (duration / barCount),
								times: [0, 0.28, 1],
							}}
						/>
					</motion.div>
				);
			})}
		</div>
	);
}

export { Spinner };
