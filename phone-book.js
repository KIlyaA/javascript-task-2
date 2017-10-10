'use strict';

exports.isStar = true;

const phoneBook = new Map();
const PHONE_PATTERN = /^(\d{3})(\d{3})(\d{2})(\d{2})$/;

const formatPhone = phone => phone.replace(PHONE_PATTERN, (match, ...parts) =>
    `+7 (${parts[0]}) ${parts[1]}-${parts[2]}-${parts[3]}`);

const search = query => (query ? Array.from(phoneBook.entries()) : [])
    .filter(([phone, { name, email }]) =>
        query === '*' || phone.includes(query) || name.includes(query) || email.includes(query));

exports.add = (phone, name, email = '') => (name && PHONE_PATTERN.test(phone) &&
    !phoneBook.has(phone)) ? phoneBook.set(phone, { name, email }) || true : false;

exports.update = (phone, name, email = '') => (name && phoneBook.has(phone))
    ? phoneBook.set(phone, { name, email }) || true : false;

exports.findAndRemove = query => search(query).filter(([phone]) => phoneBook.delete(phone)).length;
exports.find = query => search(query)
    .map(([phone, { name, email }]) => `${name}, ${formatPhone(phone)}${email ? `, ${email}` : ''}`)
    .sort();

exports.importFromCsv = csv => csv.split('\n').filter(line => {
    const [name, phone, email] = line.split(';');

    return exports.add(phone, name, email) || exports.update(phone, name, email);
}).length;
