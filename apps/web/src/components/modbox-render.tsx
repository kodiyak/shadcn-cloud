'use client';

/**
 * Placeholder for Modbox Render Component
 * Temporary code to demonstrate how to load and render modules using Modbox.
 */

import { Modbox } from '@modbox/core';
import {
	cache,
	external,
	graphBuilder,
	logger,
	resolver,
	swc,
	virtual,
} from '@modbox/plugins';

export default function ModboxRender() {
	const load = async () => {
		const modbox = await Modbox.boot({
			debug: false,
			plugins: [
				resolver({
					extensions: ['.js', '.ts', '.tsx', '.jsx'],
					alias: { '@/': '/src/' },
					index: true,
				}),
				cache(),
				virtual(),
				external(),
				swc({
					extensions: ['.js', '.ts', '.tsx', '.jsx'],
					jsc: {
						target: 'es2022',
						parser: {
							syntax: 'typescript',
							tsx: true,
						},
						transform: {
							legacyDecorator: true,
							decoratorMetadata: true,
							react: {
								development: true,
								runtime: 'automatic',
							},
						},
					},
					sourceMaps: true,
					module: {
						type: 'es6',
						strict: false,
						ignoreDynamic: true,
						importInterop: 'swc',
					},
				}),
				graphBuilder(),
				logger(),
			],
		});
		modbox.fs.writeFile(
			'/main.jsx',
			`import { createRoot } from 'react-dom/client'
        import { useState } from 'react';
  
        const Application = () => {
          const [count, setCount] = useState(0);
          return (
            <div>
              <h1>Count: {count}</h1>
              <button onClick={() => setCount(count + 1)}>Increment</button>
              <button onClick={() => setCount(count - 1)}>Decrement</button>
            </div>
          )
        }
  
        createRoot(document.getElementById('modboxRoot')).render(
          <Application />,
        )`,
		);

		await modbox.mount('/main.jsx');
	};

	return (
		<div
			style={{
				width: '100vw',
				height: '100vh',
				background: '#000',
			}}
		>
			<div id={'modboxRoot'}></div>
			<button
				type={'button'}
				onClick={async () => {
					await load();
				}}
			>
				Carregar Módulos
			</button>
		</div>
	);
}
