import request from '@/utils/request';

export async function queryFinance() {
    return request('/finance/findAllFinance');
}
export async function queryByDate(params) {
    return request('/finance/findByDate', {
        params: { date: params },
    });
}