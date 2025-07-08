import {
	MiniCalendar,
	MiniCalendarDay,
	MiniCalendarDays,
	MiniCalendarNavigation,
} from '/index.tsx';

export default function CalendarPreview() {
	return (
		<MiniCalendar>
			<MiniCalendarNavigation direction="prev" />
			<MiniCalendarDays>
				{(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
			</MiniCalendarDays>
			<MiniCalendarNavigation direction="next" />
		</MiniCalendar>
	);
}
