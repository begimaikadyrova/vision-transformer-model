def gen_pydot_graph():
    import pydot
    import ViT

    factory, model, _, _, _, _ = ViT.get_factory_model()
    g, rg, layer_weights = ViT.get_graph(factory, model)

    graph = pydot.Dot(graph_type='graph')
    visited = set()

    for node in g:
        graph.add_node(pydot.Node(node, label = node  + "\n\n" + "\n".join(layer_weights[node])))


    def make_graph(node):
        print(node)
        if not node in rg:
            return
        for edge in rg[node]:
            graph.add_edge(pydot.Edge(node, edge))
            if edge not in visited:
                visited.add(edge)
                make_graph(edge)

                
            
            
    make_graph(next(iter(g)))


    graph.write_png('graph.png')

