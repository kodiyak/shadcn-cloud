import * as motion from 'motion/react-client';
import { useState } from 'react';
import { Button } from '/index.tsx';

const MButton = motion.create(Button);

export default function MotionButton() {
	const [count, setCount] = useState(0);

	return (
		<MButton
			animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
			initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
			onClick={() => {
				setCount((old) => old + 2);
			}}
			whileTap={{ scale: 0.9, filter: 'blur(5px)' }}
		>
			My Count Button: {count}
		</MButton>
	);
}
