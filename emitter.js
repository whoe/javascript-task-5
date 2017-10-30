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
                if (eventRecipients === event || eventRecipients.startsWith(`${event}.`)) {
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
                recipients.forEach(recipient => {
                    recipient.handler.call(recipient.context);
                });
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
            let counter = 0;
            this.recipientsOfEvents[event].push({
                context,
                handler: () => {
                    if (counter++ < times) {
                        handler.call(context);
                    }
                }
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
            let counter = 0;
            this.recipientsOfEvents[event].push({
                context,
                handler: () => {
                    if (counter++ % frequency === 0) {
                        handler.call(context);
                    }
                }
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
