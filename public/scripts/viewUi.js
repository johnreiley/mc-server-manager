export default class viewUi {
    constructor() {
        this.body = document.querySelector('body');
        this.content = document.querySelector('#app');
        this.loadingSpinner = document.querySelector('#loading-overlay');
    }

    toggleLoadingSpinner() {
        if (this.loadingSpinner.style.display == 'none') {
            this.loadingSpinner.style.display = 'block';
        } else {
            this.loadingSpinner.style.display = 'none';
        }
    }

    fadeLoadingSpinner() {
      console.log('fadeLoadingSpinner()')
        if (this.loadingSpinner.style.display = 'block') {
            this.loadingSpinner.classList.add('dissolve');
            setTimeout(() => {
                this.loadingSpinner.style.display = 'none';
                this.loadingSpinner.classList.remove('dissolve');
            }, 500);
        }
    }

    scrollToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    /**************** GENERATORS ******************/

    generateToast(message, duration) {
        var toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `
        <div class="toast-body">
            ${message}
        </div>`;

        this.body.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('display-toast');
        }, 20);

        setTimeout(() => {
            toast.classList.remove('display-toast');
            setTimeout(() => {
                this.body.removeChild(toast);
            }, 300)
        }, duration);

        toast.ontouchend =
            toast.onclick = () => {
                toast.classList.remove('display-toast');
            }
    }

    generateConfirmBox(message, confirm, cancel) {

    }


}