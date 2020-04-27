import request from '@/utils/request';

export async function queryAll() {
    return request('/testReport/findAllTestReport');
}

// export async function updateInfo(params) {
//     return request('/testReport/UpdateUser', {
//         method: 'POST',
//         data: params,
//     });
// }

export async function CreateTestReport(params) {
    return request('/testReport/CreateTestReport', {
        method: 'POST',
        data: params,
    });
}