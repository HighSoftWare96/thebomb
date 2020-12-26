function createInviteId() {
  let result = '';
  const pickers = '1234567890abcdefghijklmnopqrstwxz';
  for (let i = 0; i < 20; i++) {
    result += pickers.charAt(Math.ceil(Math.random() * pickers.length));
  }
  return result;
}

module.exports = {createInviteId};