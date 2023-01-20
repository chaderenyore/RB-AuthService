

exports.rollback = async (service, query) => {
   try {
     await service.deletOne(query);
   } catch (error) {
    console.error(error)
   }
}