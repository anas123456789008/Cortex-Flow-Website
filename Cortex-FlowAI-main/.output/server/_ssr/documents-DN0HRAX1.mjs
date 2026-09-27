import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-j4Rv7MKA.mjs";
import { a as require_jsx_runtime, i as require_react, r as useQueryClient, t as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { C as LoaderCircle, D as FileSpreadsheet, E as FileText, F as CircleAlert, P as CircleCheck, a as Upload, l as Trash2 } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./app-shell-Ddzd8qaQ.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as useDropzone } from "../_libs/react-dropzone.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-DN0HRAX1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
function pick(row, keys) {
	for (const k of Object.keys(row)) {
		const norm = k.toLowerCase().replace(/[\s_-]/g, "");
		if (keys.includes(norm)) return row[k];
	}
}
async function parseCsvToTransactions(file, userId, documentId) {
	return new Promise((resolve) => {
		import_papaparse.default.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: async (results) => {
				const rows = [];
				let skipped = 0;
				for (const raw of results.data) {
					const dateStr = pick(raw, [
						"date",
						"occurredon",
						"occureddate",
						"transactiondate",
						"postdate"
					]);
					const desc = pick(raw, [
						"description",
						"desc",
						"merchant",
						"name",
						"details",
						"memo"
					]) ?? "Transaction";
					const cat = pick(raw, [
						"category",
						"type",
						"tag"
					]) ?? "Other";
					const amtStr = pick(raw, [
						"amount",
						"value",
						"debit",
						"credit"
					]);
					const typeStr = pick(raw, [
						"type",
						"transactiontype",
						"kind"
					]);
					if (!dateStr || !amtStr) {
						skipped++;
						continue;
					}
					const d = new Date(dateStr);
					if (isNaN(d.getTime())) {
						skipped++;
						continue;
					}
					const amt = parseFloat(String(amtStr).replace(/[^0-9.\-]/g, ""));
					if (isNaN(amt)) {
						skipped++;
						continue;
					}
					const inferredType = typeStr && /income|credit|deposit/i.test(typeStr) ? "income" : typeStr && /expense|debit|withdraw/i.test(typeStr) ? "expense" : amt < 0 ? "expense" : "income";
					rows.push({
						user_id: userId,
						document_id: documentId,
						occurred_on: d.toISOString().slice(0, 10),
						description: String(desc).slice(0, 200),
						category: String(cat).slice(0, 50),
						amount: Math.abs(amt),
						type: inferredType
					});
				}
				if (rows.length > 0) {
					const { error } = await supabase.from("transactions").insert(rows);
					if (error) {
						resolve({
							inserted: 0,
							skipped: skipped + rows.length
						});
						return;
					}
				}
				resolve({
					inserted: rows.length,
					skipped
				});
			},
			error: () => resolve({
				inserted: 0,
				skipped: 0
			})
		});
	});
}
function DocumentsPage() {
	const qc = useQueryClient();
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const { data: docs = [], isLoading } = useQuery({
		queryKey: ["documents"],
		queryFn: async () => {
			const { data } = await supabase.from("financial_documents").select("*").order("upload_date", { ascending: false });
			return data ?? [];
		}
	});
	const upload = (0, import_react.useCallback)(async (files) => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) return;
		setUploading(true);
		setProgress(10);
		try {
			for (const file of files) {
				const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
				const path = `${u.user.id}/${Date.now()}-${file.name}`;
				const { error: uErr } = await supabase.storage.from("financial-documents").upload(path, file);
				if (uErr) throw uErr;
				setProgress(50);
				const { data: docRow, error: dErr } = await supabase.from("financial_documents").insert({
					user_id: u.user.id,
					file_name: file.name,
					document_type: ext.toUpperCase(),
					file_path: path,
					status: "processed"
				}).select().single();
				if (dErr) throw dErr;
				setProgress(75);
				if (ext === "csv" && docRow) {
					const { inserted, skipped } = await parseCsvToTransactions(file, u.user.id, docRow.id);
					toast.success(`${file.name}: ${inserted} transactions imported${skipped ? `, ${skipped} skipped` : ""}`);
				} else toast.success(`Uploaded ${file.name}`);
			}
			setProgress(100);
			qc.invalidateQueries({ queryKey: ["documents"] });
			qc.invalidateQueries({ queryKey: ["recent-docs"] });
			qc.invalidateQueries({ queryKey: ["transactions"] });
		} catch (e) {
			toast.error(e.message ?? "Upload failed");
		} finally {
			setTimeout(() => {
				setUploading(false);
				setProgress(0);
			}, 400);
		}
	}, [qc]);
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: upload,
		accept: {
			"application/pdf": [".pdf"],
			"text/csv": [".csv"]
		},
		multiple: true
	});
	async function remove(doc) {
		if (!confirm(`Delete "${doc.file_name}"? This will also remove any imported transactions.`)) return;
		await supabase.storage.from("financial-documents").remove([doc.file_path]);
		await supabase.from("financial_documents").delete().eq("id", doc.id);
		qc.invalidateQueries({ queryKey: ["documents"] });
		qc.invalidateQueries({ queryKey: ["transactions"] });
		toast.success("Document and linked transactions deleted");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "animate-fade-up space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold sm:text-4xl",
				children: "Documents"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Upload bank statements and reports. PDF and CSV supported."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				...getRootProps(),
				className: `cursor-pointer rounded-2xl border-2 border-dashed bg-glass p-10 text-center backdrop-blur transition ${isDragActive ? "border-violet bg-violet/10" : "border-border hover:border-violet/40"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", { ...getInputProps() }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl gradient-violet glow-violet",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
							className: "text-white",
							size: 22
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-semibold",
						children: isDragActive ? "Drop to upload" : "Drop your PDF or CSV here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "or click to browse — max 25MB per file"
					}),
					uploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-white/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full gradient-violet transition-all",
							style: { width: `${progress}%` }
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-glass backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold",
						children: "Your documents"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [docs.length, " total"]
					})]
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-10 text-center text-sm text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto animate-spin" })
				}) : docs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-12 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-glass",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
							className: "text-muted-foreground",
							size: 20
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No documents uploaded yet"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 font-medium",
										children: "File Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 font-medium",
										children: "Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 font-medium",
										children: "Uploaded"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3 font-medium",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/50 transition hover:bg-glass-hover",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [d.document_type === "CSV" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, {
												size: 16,
												className: "text-emerald"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
												size: 16,
												className: "text-violet"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: d.file_name
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "pl-7 text-[11px] text-muted-foreground",
											children: formatDateTime(d.upload_date)
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground",
									children: d.document_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-muted-foreground",
									children: formatDateTime(d.upload_date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: d.status })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-5 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => remove(d),
										className: "rounded-md p-1.5 text-muted-foreground transition hover:bg-rose/10 hover:text-rose",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { size: 14 })
									})
								})
							]
						}, d.id)) })]
					})
				})]
			})
		]
	}) });
}
function formatDateTime(iso) {
	const d = new Date(iso);
	return `${d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	})} · ${d.toLocaleTimeString("en-US", {
		hour: "numeric",
		minute: "2-digit"
	})}`;
}
function StatusBadge({ status }) {
	const map = {
		processed: {
			cls: "bg-emerald/10 text-emerald border-emerald/30",
			icon: CircleCheck,
			label: "Processed"
		},
		processing: {
			cls: "bg-amber/10 text-amber border-amber/30",
			icon: LoaderCircle,
			label: "Processing"
		},
		failed: {
			cls: "bg-rose/10 text-rose border-rose/30",
			icon: CircleAlert,
			label: "Failed"
		}
	};
	const s = map[status] ?? map.processed;
	const Icon = s.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${s.cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			size: 11,
			className: status === "processing" ? "animate-spin" : ""
		}), s.label]
	});
}
//#endregion
export { DocumentsPage as component };
