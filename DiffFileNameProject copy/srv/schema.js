module.exports = (srv) => {

  srv.on('READ', 'Books', async (req) => {
    return [
      { ID: 1, title: 'Book 1', author: 'Author A' },
      { ID: 2, title: 'Book 2', author: 'Author B' }
    ]
  })

}