import React from 'react';
import { storiesOf } from '@kadira/storybook';
import { default as Hi } from '../build';

storiesOf('HireHighlighter - all', module)
	.add('[ ]', () =>
		<Hi>Grace happens when you know core so essentially that whatsoever you are shining is your beauty.</Hi>
	)
	.add('[ ] (with markup)', () =>
		<Hi>
			Grace happens when you know <ins>core</ins> so that <del>whatsoever</del> you are shining is your beauty.
		</Hi>
	);

storiesOf('HireHighlighter - query', module)
	.add('[query={null}', () =>
		<Hi query={null}>The tribble warps pattern like a mysterious particle.</Hi>
	)
	.add('[query={undefined}', () =>
		<Hi query={undefined}>The tribble warps pattern like a mysterious particle.</Hi>
	)
	.add('[query="as"]', () =>
		<Hi query="as">Avast, yer not lootting me as a treasure!</Hi>
	)
	.add('[query="as"] (with markup)', () =>
		<Hi query="as"><ins>Avast</ins>, yer not lootting me <del>as</del> a treasure!</Hi>
	)
	.add('[query="x-ray"]', () =>
		<Hi query="x-ray">Mystery, x-ray vision, and mind.</Hi>
	)
	.add('[query="squeezing rich meatballs"]', () =>
		<Hi query="squeezing rich meatballs">When squeezing rich meatballs, be sure they are room temperature.</Hi>
	);

storiesOf('HireHighlighter - query with milestones', module)
	.add('[query="x-ray" milestones]', () =>
		<Hi query="x-ray" milestones>
			Mystery, x-<ins>ray</ins> vision, and mind.<br />
			Tragedy, ionic cannon, and assimilation. X-<br />
			ray wind is a chemical x-ray sensor.
		</Hi>
	)
	.add('[query="squeezing rich meatballs" milestones]', () =>
		<Hi query="squeezing rich meatballs" milestones>When squeezing <del>rich</del> meatballs, be sure they are room temperature.</Hi>
	)
	.add('[query="aha"] milestones', () =>
		<Hi query="aha" milestones>Aha, haahaahaa, hahahaha!</Hi>
	);

storiesOf('HireHighlighter - start & end selectors', module)
	.add('[startNodeSelector=".start" endNodeSelector=".end" idAttribute="data-id"]', () =>
		<Hi
			endNodeSelector=".end"
			idAttribute="data-id"
			startNodeSelector=".start"
		>
			<p>Yo-ho-ho, yer not scraping me <a className="start" data-id="1" />without a beauty!</p>
			<p>Sharks stutter<a className="end" data-id="1" /> from amnesties like coal-black bilge rats.</p>
		</Hi>
	)
	.add('[startNodeSelector=".start" endNodeSelector=".end" idAttribute="data-id"] - overlap', () =>
		<Hi
			endNodeSelector=".end"
			idAttribute="data-id"
			startNodeSelector=".start"
		>
			<p>Yo-ho-ho, yer not <a className="start" data-id="2" />scraping me <a className="start" data-id="1" />without a beauty!</p>
			<p>Sharks<a className="end" data-id="2" /> stutter<a className="end" data-id="1" /> from amnesties like coal-black bilge rats.</p>
		</Hi>
	);

storiesOf('HireHighlighter - overlap', module)
	.add('[ ] (double)', () =>
		<div>Confucius says: <Hi><Hi>man</Hi> and om</Hi>.</div>
	)
	.add('[ ] (triple)', () =>
		<div>Confucius <Hi>says: <Hi><Hi>man</Hi> and om</Hi>.</Hi></div>
	)
	.add('[ ] (quadruple)', () =>
		<div><Hi>Confucius <Hi>says: <Hi><Hi>man</Hi> and om</Hi>.</Hi></Hi></div>
	);

storiesOf('HireHighlighter - custom node and class name', module)
	.add('[hlNodeName="div" hlClassName="my-hi"]', () =>
		<div>Confucius says: <Hi hlNodeName="div" hlClassName="my-hi">man and om</Hi>.</div>
	);
