import { collectMoney } from "@/payment";
import { headers } from "next/headers";

export async function POST(req: any, { params }: any) {
  var body = await req.json()
  console.log(body, "body");
  console.log(params, 5)
  var res = { message: "No Data", data: [] }
  if (params == "payment") {
    res = { message: "No Data", data: [] }
  }
  var pay: { operation: boolean, transaction: boolean } | any = await collectMoney({ amount: body.amount, service: body.operator, payer: body.telephone });
  console.log(pay)
  return new Response(
    JSON.stringify(res), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 201,
  })
}
