import * as motion from 'motion/react-client';
import { Button } from '/index.tsx';

export default function MotionButton() {
	return (
		<motion.div
			animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
			className="flex flex-col"
			initial={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
			whileTap={{ scale: 0.9, filter: 'blur(5px)' }}
		>
			<Button>TrialsPreview 66111444Button</Button>
		</motion.div>
	);
}
