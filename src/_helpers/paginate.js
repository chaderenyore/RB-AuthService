exports.getPaginatedRecords = async (
    model,
    { limit: specifiedLimit = 10, page, data = {}, selectedFields, sortFilter = {} }
  ) => {
    try {
      const limit = Math.min(specifiedLimit, 100); // restrict limit to 100
      const offset = 0 + (Math.abs(page || 1) - 1) * limit;
  
      const modelData = await model.find({ ...data }).countDocuments();
  
      const result = await model
        .find({ ...data })
        .select(selectedFields ? selectedFields : "")
        .skip(offset)
        .limit(limit)
        .sort(sortFilter);
  
       return {
        data: result,
        pagination: {
          pageSize: limit, //number of content yousee per page
          totalCount: modelData, //Total number of records
          pageCount: Math.ceil(modelData / limit), //How many pages will be available
          currentPage: +page, //if you're on page 1 or 18...
          hasNext: page * limit < modelData,
        },
      };
    } catch (err) {
      console.log(err);
    }
  };
  