export interface TabsProps<T extends string> {
	tabs: { id: T; label: string }[];
	active: T;
	onChange: (id: T) => void;
}

export function Tabs<T extends string>({
	tabs,
	active,
	onChange,
}: TabsProps<T>) {
	return (
		<div className="tabs" role="tablist" aria-label="Big O tabs">
			{tabs.map((t) => (
				<button
					key={t.id}
					role="tab"
					className="tab"
					aria-selected={t.id === active}
					onClick={() => onChange(t.id)}
				>
					{t.label}
				</button>
			))}
		</div>
	);
}
