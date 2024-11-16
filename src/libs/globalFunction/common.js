// 全局函数 - 公共操作相关
const commonFunction = {
	// 时间戳处理
	formatTimestamp: function (value, spe = '/') {
		if (!value) {
			return ''
		}
		//value = value*1000
		let data = new Date(value)
		let year = data.getFullYear()
		let month = parseInt(data.getMonth()) + 1
		let day = data.getDate()
		let h = data.getHours()
		let mm = data.getMinutes()
		let s = data.getSeconds()
		month = month >= 10 ? month : '0' + month
		day = day >= 10 ? day : '0' + day
		h = h >= 10 ? h : '0' + h
		mm = mm >= 10 ? mm : '0' + mm
		s = s >= 10 ? s : '0' + s
		let rt = `${year}${spe}${month}${spe}${day} ${h}:${mm}:${s}`
		if (mm == 34 && s == 34) {
			//debugger
		}
		return rt
	}
}
export default commonFunction
