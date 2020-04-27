import request from '@/utils/request';

export async function queryFinance() {
    return request('/finance/findAllFinance');
}