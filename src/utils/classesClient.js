const checkTeacherAccess = async (teacherId, classDisciplineId) => {
  const baseUrl = process.env.CLASSES_SERVICE_URL;
  if (!baseUrl) return false;

  const timeoutMs = parseInt(process.env.CLASSES_SERVICE_TIMEOUT_MS, 10);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `${baseUrl}/classes/checkTeacherAccess/${teacherId}/${classDisciplineId}`,
      { method: 'GET', signal: controller.signal }
    );
    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data?.hasAccess);
  } catch (err) {
    return false;
  } finally {
    clearTimeout(timer);
  }
};

module.exports = { checkTeacherAccess };
