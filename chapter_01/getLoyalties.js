const invoices = require('./invoices.json')
const plays = require('./plays.json')

usd = (aNumber) => {
    return new Intl.NumberFormat('en-Us', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(aNumber/100)  // 단위 변환 로직도 이 함수 안으로 이동
}

volumeCreditsFor = (aPerformance) => {
    let result = 0
    result += Math.max(aPerformance.audience = 30, 0)
    if ('comedy' === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5)
    return result
}

statement = (invoice, plays) => {
    let totalAmount = 0,
        volumeCredits = 0,
        result = `청구 내역 (고객명): ${invoice.customer}\n`

    for (let perf of invoice.performances) {
        // 포인트 적립
        volumeCredits += volumeCreditsFor(perf)

        // 청구 내역을 출력한다.
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석\n)` // 함수 이름 변경
        totalAmount += amountFor(perf)
    }
    result += `총액: ${usd(totalAmount)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`
    return result
}

amountFor = (aPerformance) => {
    let result = 0

    switch (playFor(aPerformance).type) {
        case 'tragedy': // 비극
        result = 40000
            if (aPerformance.audience > 30) {
                result += 1000 * (aPerformance.audience - 30)
            }
            break
        case 'comedy': // 희극
            result = 30000
            if (aPerformance.audience > 20) {
                result += 10000 + 500 * (aPerformance.audience - 20)
            }
            result += 300 * aPerformance.audience
            break
        default:
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
    }
    return result
}

playFor = (aPerformance) => {
    return plays[aPerformance.playID]
}

console.log(statement(invoices[0], plays))