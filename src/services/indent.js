import request from '@/utils/request';

export async function queryIndent() {
    return request('/indent/findAllIndent');
}

export async function queryIndentByIndentId() {
    return request('/indent/findByIndentId');
}

export async function queryDetailByIndId(params) {
    return request('/indent/findByDetail', {
        params: { indId: params },
    });
}

export async function createIndent(params) {
    return request('/indent/CreateIndent', {
        method: 'POST',
        data: params,
    });
}
export async function updateIndent(params) {
    return request('/indent/UpdateIndent', {
        method: 'POST',
        data: params,
    });
}

