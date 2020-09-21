export default {
    toast: {
        show(text, ms, color) {
            let toast = document.createElement('div')
            toast.classList.add('toast')
            toast.textContent = text

            toast.style.top = 10 + this._index * 45 + 'px'
            if (color) toast.style.backgroundColor = color

            document.body.append(toast)
            let timer = setTimeout(() => {
                toast.style.animation = 'leaveToast 0.5s'
                toast.addEventListener('animationend', () => {
                    toast.remove()
                    this._index--
                })
            }, Math.max(ms, 550))
            toast.addEventListener('click', (event) => {
                toast.style.animation = 'leaveToast 0.5s'
                toast.addEventListener('animationend', () => {
                    toast.remove()
                    this._index--
                })

                clearTimeout(timer)
            })

            this._index++
        },
        colors: {
            red: '#f88',
            green: '#8f8'
        },
        _index: 0
    }
}