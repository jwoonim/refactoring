import fs from 'fs'

import createStatementData from './createStatementData.js'
const invoices = JSON.parse(fs.readFileSync('./invoices.json'));
const plays = JSON.parse(fs.readFileSync('./plays.json'));

function htmlStatement(invoice, plays) {
    return renderHtml(createStatementData(invoice, plays))
}

function renderHtml(data) {
    let result = `청구 내역 (고객명): ${data.customer}\n`
    for (let perf of data.performances) {
        result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`
    }
    result += `총액: ${usd(data.totalAmount)}\n`
    result += `적립 포인트: ${data.totalVolumeCredits}점\n`
    return result
}

function usd(aNumber) {
    return new Intl.NumberFormat('en-Us', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(aNumber/100)
}

console.log(htmlStatement(invoices[0], plays))