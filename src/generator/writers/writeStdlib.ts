import { WriterContext } from "../Writer";

export function writeStdlib(ctx: WriterContext) {
    ctx.fun('__tact_set', () => {
        ctx.append(`forall X -> tuple __tact_set(tuple x, X v, int i) asm "SETINDEXVARQ";`);
    });
    ctx.fun('__tact_nop', () => {
        ctx.append(`() __tact_nop() impure asm "NOP";`);
    });
    ctx.fun('__tact_not_null', () => {
        ctx.append(`forall X -> X __tact_not_null(X x) { throw_if(14, null?(x)); return x; }`);
    });
    ctx.fun('__tact_load_address', () => {
        ctx.append(`(slice, slice) __tact_load_address(slice cs) inline {`);
        ctx.inIndent(() => {
            ctx.append(`slice raw = cs~load_msg_addr();`);
            ctx.append(`return (cs, raw);`);
        });
        ctx.append(`}`);
    });
    ctx.fun('__tact_store_address', () => {
        ctx.append(`builder __tact_store_address(builder b, slice address) inline {`);
        ctx.inIndent(() => {
            ctx.append(`b = b.store_slice(address);`) // Is std address
            ctx.append(`return b;`);
        });
        ctx.append(`}`);
    });
    ctx.fun('__tact_compute_contract_address', () => {
        ctx.append('slice __tact_compute_contract_address(int chain, cell code, cell data) {')
        ctx.inIndent(() => {

            // Compute hash
            ctx.append(`var b = begin_cell();`);
            ctx.append(`b = b.store_uint(0, 2);`);
            ctx.append(`b = b.store_uint(3, 2);`);
            ctx.append(`b = b.store_uint(0, 1);`);
            ctx.append(`b = b.store_ref(code);`);
            ctx.append(`b = b.store_ref(data);`);
            ctx.append(`var hash = cell_hash(b.end_cell());`);

            // Compute address
            ctx.append(`var b2 = begin_cell();`) // Is std address
            ctx.append(`b2 = b2.store_uint(2, 2);`) // Is std address
            ctx.append(`b2 = b2.store_uint(0, 1);`) // Non-unicast
            ctx.append(`b2 = b2.store_int(chain, 8);`) // Workchain (0 or -1)
            ctx.append(`b2 = b2.store_uint(hash, 256);`) // Address hash
            ctx.append(`return b2.end_cell().begin_parse();`);
        });
        ctx.append('}');
    });
    ctx.fun('__tact_to_tuple', () => {
        ctx.append(`forall X -> tuple __tact_to_tuple(X x) impure asm "NOP";`);
    });
    ctx.fun('__tact_from_tuple', () => {
        ctx.append(`forall X -> X __tact_from_tuple(tuple x) impure asm "NOP";`);
    });
    ctx.fun('__tact_dict_set_int_cell', () => {
        ctx.append(`(cell, ()) __tact_dict_set_int_cell(cell d, int kl, int k, cell v) {`);
        ctx.inIndent(() => {
            ctx.append(`if (null?(v)) {`);
            ctx.inIndent(() => {
                ctx.append(`var (r, ok) = idict_delete?(d, kl, k);`);
                ctx.append(`return (r, ());`);
            });
            ctx.append(`} else {`);
            ctx.inIndent(() => {
                ctx.append(`return (idict_set_ref(d, kl, k, v), ());`);
            });
            ctx.append(`}`);
        });
        ctx.append('}')
    });
    ctx.fun('__tact_dict_set_int_int', () => {
        ctx.append(`(cell, ()) __tact_dict_set_int_int(cell d, int kl, int k, int v, int vl) {`);
        ctx.inIndent(() => {
            ctx.append(`if (null?(v)) {`);
            ctx.inIndent(() => {
                ctx.append(`var (r, ok) = idict_delete?(d, kl, k);`);
                ctx.append(`return (r, ());`);
            });
            ctx.append(`} else {`);
            ctx.inIndent(() => {
                ctx.append(`return (idict_set_ref(d, kl, k, begin_cell().store_int(v, vl).end_cell()), ());`);
            });
            ctx.append(`}`);
        });
        ctx.append('}')
    });
}