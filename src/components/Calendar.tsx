import React from 'react';
import './Calendar.scss';

import { observable } from 'mobx';
import { chunk } from 'lodash';

interface Props {
	style?: React.CSSProperties; // 样式
	defaultDate?: { year: number; month: number; day: number }; // 默认的天气
	// onChang(currentDate: string): void;
}

class Calendar extends React.Component<Props, {}> {
	@observable year?: number; // 选择的年份数据;
	@observable month?: number; // 选择的月份数据;
	@observable day?: number; // 选择的是哪天;
	@observable // 今天的年、月、日信息
	todayDate: {
		year?: number;
		month?: number;
		day?: number;
	} = {};
	@observable
	monthData?: { year: number; month: number; day: number }[][]; // 月份数据
	@observable
	selectDate: {
		// 当前选中的日期
		year?: number;
		month?: number;
		day?: number;
	} = {};

	componentDidMount() {}

	/**
	 * @description 初始化当前时间
	 */
	initDate() {
		const { defaultDate } = this.props;
		// 如果有默认值取默认值，没有则取当天的日期值;
		if (defaultDate) {
			let { year, month, day } = defaultDate;
			this.year = year;
			this.month = month;
			this.day = day;
			this.todayDate = defaultDate;
			this.selectDate = defaultDate;
		} else {
			let date = new Date();
			// 当前年
			this.year = date.getFullYear();
			// 当前月;
			this.month = date.getMonth();
			// 当前日;
			this.day = date.getDate();

			let current = {
				year: this.year,
				month: this.month,
				day: this.day,
			};
			this.todayDate = { ...current };
			this.selectDate = { ...current };
			// 根据年月算出天数信息;
			// this.monthData
		}
	}

	/**
	 * @description 获取当月的日历信息（第一天是星期几等信息）
	 * @param year
	 * @param month
	 */
	getMonthDays(year?: number, month?: number) {
		let ret = [];
		if (!year || !month) {
			let today = new Date();
			year = today.getFullYear();
			month = today.getMonth() + 1;
		}
		// 获取当月第一天
		let firstDay = new Date(year, month - 1, 1);
		// 获取当月第一天是星期几
		let firstDayWeekDay = firstDay.getDay();
		// 星期日
		if (firstDayWeekDay === 0) {
			firstDayWeekDay = 7;
		}
		// 获取当月最后一天
		let lastDay = new Date(year, month, 0);
		// 获取当月最后一天是几号（29，29，30，31）
		let lastDate = lastDay.getDate();
		// 获取上一个月的最后一天
		let lastDayOfLastMonth = new Date(year, month - 1, 0);
		// 获取上一个月最后一天是几号（28||29||30||31）;
		let lastDateOfLastMonth = lastDayOfLastMonth.getDate();
		// 获取上个月最后一天是星期几
		let lastWeekDayOfLastMonth = firstDayWeekDay - 1;
	}

	render() {
		return (
			<div className="calendar">
				<div className="calendar-year-month"></div>
				<div className="calendar-weekday"></div>
				<div className="calendar-day"></div>
			</div>
		);
	}
}

export default Calendar;
