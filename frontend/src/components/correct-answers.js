import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";

export class CorrectAnswers {
    constructor() {
        this.userInfo = Auth.getUserInfo();
        this.init();
    }

    async init() {
        try {
            const response = await CustomHttp.request(config.host + '/tests/' + UrlManager.getQueryParams().id + '/result/details?userId=' + this.userInfo.userId);
            if (!response) {
                throw new Error(response.error);
            }
            document.getElementById('test-name').innerText = response.test.name;
            document.getElementById('completed-by').innerText = this.userInfo.fullName + ', ' + this.userInfo.email;
            const questionsElement = document.getElementById('questions');

            response.test.questions.forEach((question, index) => {
                const questionTitle = document.createElement('div');
                questionTitle.className = 'question-title';
                questionTitle.innerHTML = '<span>Вопрос ' + (index + 1) + ':</span> ' + question.question;
                const answerOptionsElement = document.createElement('ul');
                answerOptionsElement.className = 'ul';
                question.answers.forEach(answer => {
                    const li = document.createElement('li');
                    li.className = 'li';
                    li.innerHTML = '<div class="marker"></div><div>' + answer.answer + '</div>';
                    const marker = li.querySelector('.marker');
                    if ('correct' in answer) {
                        marker.style.border = '6px solid';
                        if (answer.correct) {
                            li.style.color = '#5FDC33';
                            marker.style.borderColor = '#5FDC33';
                        } else {
                            li.style.color = '#DC3333';
                            marker.style.borderColor = '#DC3333';
                        }
                    }
                    answerOptionsElement.appendChild(li);
                });
                const questionElement = document.createElement('div');
                questionElement.appendChild(questionTitle);
                questionElement.appendChild(answerOptionsElement);
                questionsElement.appendChild(questionElement);
            });
        } catch(error) {
            console.log(error);
        }
        document.getElementById('go-back').onclick = () => window.history.back();
    }
}