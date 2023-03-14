"use strict";
const typingHistory = {
    "currentIndex": 0,
    "history": [],
    "add": function (value, selectionStart, selectionEnd) {
        this.history.length = this.currentIndex;
        this.history.push({ value, selectionStart, selectionEnd });
        this.currentIndex++;
    },
    "back": function () {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            const history = this.history[this.currentIndex];
            input.value = history.value;
            input.selectionStart = history.selectionStart;
            input.selectionEnd = history.selectionEnd;
            updateCommandHightlight();
        }
    },
    "forward": function () {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const history = this.history[this.currentIndex];
            input.value = history.value;
            input.selectionStart = history.selectionStart;
            input.selectionEnd = history.selectionEnd;
            updateCommandHightlight();
        }
    }
};
//# sourceMappingURL=history.js.map