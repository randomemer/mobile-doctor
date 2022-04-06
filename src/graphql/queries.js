/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getRecording = /* GraphQL */ `
    query GetRecording($mail_id: String!, $timestamp: String!) {
        getRecording(mail_id: $mail_id, timestamp: $timestamp) {
            mail_id
            timestamp
            bucketpath_recording
            bucketpath_denoised
            bpm
            user_doctor
            doctorInfo {
                mail_id
                first_name
                last_name
                is_doctor
                phone
                gender
            }
            audio_length
            comment
        }
    }
`;
export const listRecordings = /* GraphQL */ `
    query ListRecordings(
        $filter: TableRecordingFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listRecordings(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                mail_id
                timestamp
                bucketpath_recording
                bucketpath_denoised
                bpm
                user_doctor
                audio_length
                comment
                doctorInfo {
                    first_name
                    gender
                    is_doctor
                    last_name
                    mail_id
                    phone
                }
            }
            nextToken
        }
    }
`;
export const listRecordingsToDoctor = /* GraphQL */ `
    query ListRecordingsToDoctor(
        $filter: TableRecordingFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listRecordingsToDoctor(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                mail_id
                timestamp
                bucketpath_recording
                bucketpath_denoised
                bpm
                user_doctor
                audio_length
                comment
                userInfo {
                    first_name
                    gender
                    is_doctor
                    last_name
                    phone
                    mail_id
                }
            }
            nextToken
        }
    }
`;
export const getUser = /* GraphQL */ `
    query GetUser($mail_id: String!) {
        getUser(mail_id: $mail_id) {
            mail_id
            first_name
            last_name
            is_doctor
            phone
            gender
        }
    }
`;
export const listUsers = /* GraphQL */ `
    query ListUsers(
        $filter: TableUserFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                mail_id
                first_name
                last_name
                is_doctor
                phone
                gender
            }
            nextToken
        }
    }
`;
export const getDoctor = /* GraphQL */ `
    query GetDoctor($mail_id: String!) {
        getDoctor(mail_id: $mail_id) {
            mail_id
            years
            expertise
            clinic_name
            clinic_address
            clinic_phone
            location
        }
    }
`;
export const fetchDoctor = /* GraphQL */ `
    query FetchDoctor($mail_id: String) {
        fetchDoctor(mail_id: $mail_id) {
            mail_id
            years
            expertise
            clinic_name
            clinic_phone
            clinic_address
            location
            personalInfo {
                mail_id
                first_name
                last_name
                is_doctor
                phone
                gender
            }
        }
    }
`;
export const listDoctors = /* GraphQL */ `
    query ListDoctors(
        $filter: TableDoctorFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listDoctors(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                mail_id
                years
                expertise
                clinic_name
                clinic_phone
                clinic_address
                location
                personalInfo {
                    first_name
                    gender
                    is_doctor
                    last_name
                    mail_id
                    phone
                }
            }
            nextToken
        }
    }
`;
export const getDoctorList = /* GraphQL */ `
    query GetDoctorList {
        getDoctorList {
            items {
                mail_id
                years
                expertise
                clinic_name
                clinic_phone
                clinic_address
                location
            }
            nextToken
        }
    }
`;
