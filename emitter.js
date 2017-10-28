'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {

        /**
         * асоциативный массив, ключами которого 
         * являются события (например slide.funny),
         * значениями - массив получателей.
         * Получатель - {context: ?, handler: ?}
         */
        recipientsOfEvents: [],

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            initRecipients.call(this, event);
            this.recipientsOfEvents[event].push({
                context,
                handler
            });

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Object.keys(this.recipientsOfEvents).forEach(eventRecipients => {
                if (eventRecipients === event || eventRecipients.indexOf(`${event}.`) !== -1) {
                    this.recipientsOfEvents[eventRecipients] =
                    this.recipientsOfEvents[eventRecipients]
                        .filter(recipient => recipient.context !== context);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            do {
                let recipients = this.recipientsOfEvents[event];
                if (!recipients) {
                    continue;
                }
                for (let indexRecipient of recipients.keys()) {
                    handleEvent.call(this, event, indexRecipient);
                }
            } while ((event = getParentNamespace(event)));

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            initRecipients.call(this, event);
            this.recipientsOfEvents[event].push({
                context,
                handler,
                times
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            initRecipients.call(this, event);
            this.recipientsOfEvents[event].push({
                context,
                handler,
                frequency
            });

            return this;
        }
    };
}

/**
 * 
 * @param {String} event 
 * @returns {String}
 */
function getParentNamespace(event) {
    let indexLastDot = event.lastIndexOf('.');

    return event.substring(0, indexLastDot);
}

/**
 * 
 * @this GetEmitter
 * @param {String} event 
 */
function initRecipients(event) {
    if (this.recipientsOfEvents[event] === undefined) {
        this.recipientsOfEvents[event] = [];
    }
}


/**
 * 
 * @this GetEmitter
 * @param {String} event 
 * @param {indexRecipient} indexRecipient
 * @returns {Object}
 */
function handleEvent(event, indexRecipient) {
    let recipient = this.recipientsOfEvents[event][indexRecipient];
    if (!recipient.counter) {
        recipient.counter = 0;
    }
    if (recipient.frequency) {
        if (recipient.counter++ % recipient.frequency === 0) {
            recipient.handler.call(recipient.context);
        }
    } else if (recipient.times) {
        if (recipient.times > recipient.counter++) {
            recipient.handler.call(recipient.context);
        } else {
            this.recipientsOfEvents[event].splice(indexRecipient, 1);
        }
    } else {
        recipient.handler.call(recipient.context);
    }

    return this;
}
