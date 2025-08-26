import React, { useRef, useState, useEffect } from 'react';
import styles from './BeforeAfterSlider.module.css';

function BeforeAfterSlider({
	beforeImage,
	afterImage,
}: {
	beforeImage: string;
	afterImage: string;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [position, setPosition] = useState(50);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		const handleMouseUp = () => setIsDragging(false);
		document.addEventListener('mouseup', handleMouseUp);
		return () => document.removeEventListener('mouseup', handleMouseUp);
	}, []);

	const handleMouseDown = () => setIsDragging(true);
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!isDragging || !containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const pct = Math.min(100, Math.max(0, (x / rect.width) * 100));
		setPosition(pct);
	};

	return (
		<div
			ref={containerRef}
			className={styles.container}
			onMouseMove={handleMouseMove}
			onMouseDown={handleMouseDown}
			role="region"
			aria-label="Before after image comparison"
		>
			<img src={beforeImage} alt="Before" loading="lazy" />
			<div className={styles.overlay} style={{ width: `${position}%` }}>
				<img src={afterImage} alt="After" loading="lazy" />
			</div>
			<div className={styles.slider} style={{ left: `${position}%` }} />
		</div>
	);
}

export default BeforeAfterSlider;
export { BeforeAfterSlider };
