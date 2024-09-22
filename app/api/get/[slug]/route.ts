
export async function GET(req: any, {params}: any) {
  var params = params.slug
  var searchcParams = req.nextUrl.searchParams
  console.log(params, 5)
  console.log(searchcParams.get("example"), 6)
    var res = { message: "No Data", data: [] }
  
  return Response.json(res)   
  }
  