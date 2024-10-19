import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import TableForObjectArray, { type TableColumnOrStr } from './TableForObjectArray.svelte';

const sampleData = [{ name: 'Alice', age: '25' }];

describe('TableForObjectArray', () => {
	it('renders columns without explicit list', () => {
		render(TableForObjectArray, { data: sampleData });
		// screen.debug();
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Age')).toBeVisible();
	});

	it('renders columns with custom title', () => {
		const columns = [
			{ data: 'name', title: 'Name' },
			{ data: 'age', title: 'Age' }
		];
		render(TableForObjectArray, { data: sampleData, columns: columns });
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Age')).toBeVisible();
	});

	it('renders columns with custom title and without custom title', () => {
		const columns = ['name', { data: 'age', title: 'User Age' }];
		render(TableForObjectArray, { data: sampleData, columns: columns });
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('User Age')).toBeVisible();
	});

	it('uses the data property to determine what to render', () => {
		const columns = [{ data: 'name', title: 'Age' }];
		render(TableForObjectArray, { data: sampleData, columns: columns });
		expect(screen.queryByText('Age')).toBeVisible();
		expect(screen.queryByText('Alice')).toBeVisible();
		expect(screen.queryByText('25')).toBeNull();
	});

	it('supports custom render function, three args, val, type and row ', () => {
		const renderFn = vi.fn(() => '');

		const columns = [{ data: 'name', title: 'Age', render: renderFn }];
		render(TableForObjectArray, { data: sampleData, columns: columns });
		expect(renderFn).toBeCalledTimes(1);
		expect(renderFn).toBeCalledWith('Alice', null, sampleData[0]);
	});

	it('Renders message about having no data if none is supplied', () => {
		render(TableForObjectArray, { data: [] });
		expect(screen.getByText('No data to display')).toBeVisible();
	});

	it('capitalizes column headings when columns are not passed in', () => {
		render(TableForObjectArray, { data: sampleData });
		// screen.debug();
		expect(screen.queryByText('Name')).toBeVisible();
		expect(screen.queryByText('Age')).toBeVisible();
	});

	it('renders data', () => {
		render(TableForObjectArray, { data: sampleData });
		// screen.debug();
		expect(document.querySelector('tbody tr td')?.textContent).toBe(sampleData[0].name);
	});

	it('supports alternate render funcion renderHTML which renders the passed string as html', () => {
		const columns: TableColumnOrStr = [
			{ data: 'name', title: 'Age', renderHTML: (val) => `<strong>${val}</strong>` }
		];
		render(TableForObjectArray, { data: sampleData, columns: columns });
		screen.debug();
		expect(document.querySelector('tbody tr td strong')?.textContent).toBe(sampleData[0].name);
	});
});
