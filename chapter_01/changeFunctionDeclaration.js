const invoices = require('./invoices.json')
const plays = require('./plays.json')

/**
 * P.37
 * Change Function Declaration (함수 선언 바꾸기)
 */

statement = (invoice, plays) => {
    let totalAmount = 0,
        volumeCredit = 0,
        result = `청구 내역 (고객명): ${invoice.customer}\n`

    const format = new Intl.NumberFormat('en-Us', {
        style: 'currency', currency: 'USD', minimumFractionDigits: 2
    }).format

    for (let perf of invoice.performances) {
        // let thisAmount = amountFor(perf, playFor(perf)) // 추출한 함수 이용
        let thisAmount = amountFor(perf) // 필요 없어진 매개변수 제거

        // 포인트 적립
        volumeCredit += Math.max(perf.audience - 30, 0)
    
        // 희극 관객 5명마다 추가 포인트를 제공한다.
        if ('comedy' === playFor(perf).type) volumeCredit += Math.floor(perf.audience / 5)

        // 청구 내역을 출력한다.
        result += `${playFor(perf).name}: ${format(thisAmount/100)} (${perf.audience}석\n)`
        totalAmount += thisAmount
    }
    result += `총액: ${format(totalAmount/100)}\n`
    result += `적립 포인트: ${volumeCredit}점\n`
    return result
}

// Nested function
// amountFor = (aPerformance, play) => {
amountFor = (aPerformance) => { // 필요 없어진 매개변수 제거
    let result = 0

    // switch (play.type) {
    switch (playFor(aPerformance).type) { // play를 playFor() 호출로 변경
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
            // throw new Error(`알 수 없는 장르: ${play.type}`)
            throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`) // play를 playFor() 호출로 변경
    }
    return result
}

playFor = (aPerformance) => {
    return plays[aPerformance.playID]
}

console.log(statement(invoices[0], plays))