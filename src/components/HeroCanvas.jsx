import { useEffect, useRef } from 'react';
import styles from './HeroCanvas.module.css';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId;
    let renderer;
    let onMouseMove, onResize;
    let cancelled = false;

    import('three').then((THREE) => {
      if (cancelled) return;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x08091a, 0.032);

      const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
      camera.position.set(0, 0, 14);

      // Particle starfield
      const N = 900;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const cBlue = new THREE.Color(0x4f7cff);
      const cPurp = new THREE.Color(0x7c3fff);
      for (let i = 0; i < N; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 46;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
        const c = Math.random() < 0.5 ? cBlue : cPurp;
        col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
      const points = new THREE.Points(pGeo, new THREE.PointsMaterial({
        size: 0.09, vertexColors: true, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      scene.add(points);

      // Wireframe icosahedron core
      const core = new THREE.Group();
      const ico = new THREE.Mesh(
        new THREE.IcosahedronGeometry(4.3, 1),
        new THREE.MeshBasicMaterial({ color: 0x4f7cff, wireframe: true, transparent: true, opacity: 0.45 }),
      );
      const icoIn = new THREE.Mesh(
        new THREE.IcosahedronGeometry(2.6, 0),
        new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.3 }),
      );
      // Glowing vertices on outer ico
      const vPositions = [];
      const posAttr = ico.geometry.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        vPositions.push(new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i)));
      }
      const vGeo = new THREE.BufferGeometry().setFromPoints(vPositions);
      const verts = new THREE.Points(vGeo, new THREE.PointsMaterial({
        color: 0x7c3fff, size: 0.16, transparent: true, opacity: 0.9,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      core.add(ico, icoIn, verts);
      core.position.x = 5.2;
      scene.add(core);

      // Torus rings
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(6.2, 0.018, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x7c3fff, transparent: true, opacity: 0.45 }),
      );
      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(7.4, 0.014, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x4f7cff, transparent: true, opacity: 0.3 }),
      );
      ring1.rotation.x = Math.PI / 2.4;
      ring2.rotation.x = Math.PI / 1.8;
      ring2.rotation.y = 0.5;
      core.add(ring1, ring2);

      // Mouse parallax
      let tx = 0, ty = 0, cx = 0, cy = 0;
      onMouseMove = (e) => {
        tx = (e.clientX / innerWidth - 0.5) * 2;
        ty = (e.clientY / innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove);

      onResize = () => {
        const w = canvas.clientWidth || innerWidth;
        const h = canvas.clientHeight || innerHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        core.position.x = w < 780 ? 0 : 5.2;
        core.scale.setScalar(w < 780 ? 0.62 : 1);
      };
      window.addEventListener('resize', onResize);
      onResize();

      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        if (!reduce) {
          core.rotation.y = t * 0.22;
          core.rotation.x = Math.sin(t * 0.3) * 0.18;
          icoIn.rotation.y = -t * 0.5;
          icoIn.rotation.z = t * 0.3;
          ring1.rotation.z = t * 0.25;
          ring2.rotation.z = -t * 0.18;
          points.rotation.y = t * 0.018;
          cx += (tx - cx) * 0.04;
          cy += (ty - cy) * 0.04;
          camera.position.x = cx * 1.6;
          camera.position.y = -cy * 1.1;
          camera.lookAt(scene.position);
          verts.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04);
        }
        renderer.render(scene, camera);
      };
      animate();
    });

    return () => {
      cancelled = true;
      if (animId) cancelAnimationFrame(animId);
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onResize) window.removeEventListener('resize', onResize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
