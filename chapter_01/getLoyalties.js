const invoices = require('./invoices.json')
const plays = require('./plays.json')

usd = (aNumber) => {
    return new Intl.NumberFormat('en-Us', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format(aNumber/100)
}

volumeCreditsFor = (aPerformance) => {
    let result = 0
    result += Math.max(aPerformance.audience = 30, 0)
    if ('comedy' === playFor(aPerformance).type)
        result += Math.floor(aPerformance.audience / 5)
    return result
}

totalVolumeCredits = (invoice) => {
    let volumeCredits = 0
    for (let perf of invoice.performances) {
        // 포인트 적립
        volumeCredits += volumeCreditsFor(perf)
    }
    return volumeCredits
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

statement = (invoice, plays) => {
    let totalAmount = 0,
        result = `청구 내역 (고객명): ${invoice.customer}\n`

    for (let perf of invoice.performances) {

        // 청구 내역을 출력한다.
        result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${perf.audience}석)\n`
        totalAmount += amountFor(perf)
    }

    // let volumeCredits = 0
    // for (let perf of invoice.performances) {
    //     // 포인트 적립
    //     volumeCredits += volumeCreditsFor(perf)
    // }
    let volumeCredits = totalVolumeCredits(invoice) // 값 계산 로직을 함수로 추출

    result += `총액: ${usd(totalAmount)}\n`
    result += `적립 포인트: ${volumeCredits}점\n`
    return result
}

console.log(statement(invoices[0], plays))