// 全局函数 - 文件相关
const fileFunction = {
	
  /**
	 * 格式化文件大小
	 * @param {number} size 文件大小
	 * @param {boolean} isInteger 是否只显示整数位，默认不截取
	 * @returns {string} 文件大小（带单位）
	 */
	calculateFileSize(size, isInteger = false) {
		//console.log('calculateFileSize', size, isInteger)
		if (size == null) {
			return 0
		}
		const B = 1024
		const KB = Math.pow(1024, 2)
		const MB = Math.pow(1024, 3)
		const GB = Math.pow(1024, 4)
		if (isInteger) {
			// 截取为整数
			if (size < B) {
				return `${size} B`
			} else if (size < KB) {
				return `${(size / B).toFixed(0)} KB`
			} else if (size < MB) {
				return `${(size / KB).toFixed(0)} MB`
			} else if (size < GB) {
				return `${(size / MB).toFixed(0)} GB`
			} else {
				return `${(size / GB).toFixed(0)} TB`
			}
		} else {
			// 保留小数位
			if (size < B) {
				return `${size} B`
			} else if (size < KB) {
				return `${(size / B).toFixed(0)} KB`
			} else if (size < MB) {
				return `${(size / KB).toFixed(2)} MB`
			} else if (size < GB) {
				return `${(size / MB).toFixed(3)} GB`
			} else {
				return `${(size / GB).toFixed(4)} TB`
			}
		}
	},
  
}

export default fileFunction
