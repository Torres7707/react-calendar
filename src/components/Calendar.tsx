import React from 'react';
import './Calendar.scss';

import { observable } from 'mobx';
import { chunk } from 'lodash';
import { classicNameResolver } from 'typescript';

interface Props {
	style?: React.CSSProperties; // 样式
	defaultDate?: { year: number; month: number; day: number }; // 默认的天气
	// onChang(currentDate: string): void;
}

class Calendar extends React.Component<Props, {}> {
	@observable year: number; // 选择的年份数据;
	@observable month: number; // 选择的月份数据;
	@observable day: number; // 选择的是哪天;
	@observable // 今天的年、月、日信息
	todayDate: {
		year?: number;
		month?: number;
		day?: number;
	} = {};
	@observable
	monthData: { year: number; month: number; day: number }[][]; // 月份数据
	@observable
	selectDate: {
		// 当前选中的日期
		year?: number;
		month?: number;
		day?: number;
	} = {};

	componentDidMount() {
		this.initDate();
		console.log(this.todayDate);
	}

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
			this.monthData = this.getMonthDays(this.year, this.month);
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

		for (let i = 0; i < 7 * 6; i++) {
			let date = i - lastWeekDayOfLastMonth;
			let showDate = date;
			let thisYear = year;
			let thisMonth = month;
			// 上个月
			if (date <= 0) {
				thisMonth = month - 1;
				// 上个月在本月42格日历上显示的日期
				showDate = lastDateOfLastMonth + date;
			} else if (date > lastDate) {
				// 下个月
				thisMonth = month + 1;
				// 下个月在本月42格日历上显示的日期
				showDate = showDate - lastDate;
			}
			// 上一年
			if (thisMonth === 0) {
				thisMonth = 12;
				thisYear -= 1;
			}
			// 下一年
			if (thisMonth === 13) {
				thisMonth = 1;
				thisYear += 1;
			}

			ret.push({
				year: thisYear,
				month: thisMonth,
				day: showDate,
			});
		}

		//  拆分为7个一行的多维数组
		return chunk(ret, 7);
	}

	/**
	 *
	 * @description 通过对年月日的判断 返回相对应的clssName
	 * @param {{ year: number; month: number; day: number }} current
	 * @returns {string} move 不可选的日期 action 选中的日期
	 * @memberof Calendar
	 */
	returnDateClassName(current: {
		year: number;
		month: number;
		day: number;
	}): string {
		let className = '';
		const { year, month, day } = current;
		// 选择的年份大于今年的年份
		if (this.year > this.todayDate.year) {
			className = 'move';
			// 选择的月份大于今天的月份
		} else if (this.month > this.todayDate.month) {
			className = 'move';
			// 当天的月份和数据的月份不一样
		} else if (this.month != month) {
			className = 'move';
			// 天数大于当前的天数
		} else if (
			year === this.todayDate.year &&
			month === this.todayDate.month &&
			day > this.todayDate.day
		) {
			className = 'move';
			// 当前选中的数据
		} else if (
			year === this.selectDate.year &&
			month === this.selectDate.month &&
			day === this.selectDate.day
		) {
			className = 'active';
		}
		return className;
	}

	/**
	 * @description 修改年/月信息
	 * @param {string} type year还是month
	 * @param {number} method true为加 false为减
	 * @memberof Calendar
	 */
	changeDateInfo(type: 'year' | 'month', method?: boolean) {}

	render() {
		const { style } = this.props;
		return (
			<div className="calendar-component-all" style={style}>
				<div className="calendar-switch-all">
					<div className="calendar-left-all">
						<svg
							className="calendar-switch-year"
							onClick={() => {
								// this.changeDateInfo('year', true);
							}}
						>
							<use xlinkHref="#icon-32rilizuoqiehuan"></use>
						</svg>
						<svg
							className="calendar-switch-month"
							onClick={() => {
								// this.changeDateInfo('month', true);
							}}
						>
							<use xlinkHref="#icon-zuoqiehuan"></use>
						</svg>
					</div>
					<div className="calendar-middle-content">
						{this.year}年 {this.month}月
					</div>
					<div className="calendar-right-all">
						<svg
							className="calendar-switch-year"
							onClick={() => {
								// this.changeDateInfo('month');
							}}
						>
							<use xlinkHref="#icon-youqiehuan"></use>
						</svg>
						<svg
							className="calendar-switch-month"
							onClick={() => {
								// this.changeDateInfo('year');
							}}
						>
							<use xlinkHref="#icon-32riliyouqiehuan"></use>
						</svg>
					</div>
				</div>
				<div className="calendar-weekday">
					<div>日</div>
					<div>一</div>
					<div>二</div>
					<div>三</div>
					<div>四</div>
					<div>五</div>
					<div>六</div>
				</div>
				<div className="calendar-day">
					{this.monthData &&
						this.monthData.map((item, index) => {
							return (
								<div className="calendar-data-gruop" key={index}>
									{item.map((result) => {
										return (
											<div
												className={`calendar-data-single ${this.returnDateClassName(
													result
												)}`}
												key={result.day}
												onClick={() => {
													// 当前日期不可选的话 直接return
													if (this.returnDateClassName(result) === 'move') {
														return;
													}
													this.day = result.day;
													this.selectDate = {
														year: this.year,
														month: this.month,
														day: this.day,
													};
													// onChang &&
													// 	onChang(`${this.year}-${this.month}-${this.day}`);
												}}
											>
												{result.day}
											</div>
										);
									})}
								</div>
							);
						})}
				</div>
			</div>
		);
	}
}

export default Calendar;
